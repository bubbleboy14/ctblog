from setuptools import setup

setup(
    name='ctblog',
    version="0.1.1",
    author='Mario Balibrera',
    author_email='mario.balibrera@gmail.com',
    license='MIT License',
    description='Blogging plugin for cantools (ct)',
    long_description='This package contains a generic blog-type website.',
    packages=[
        'ctblog'
    ],
    zip_safe = False,
    install_requires = [
#        "ct >= 0.8.14.2"
    ],
    entry_points = '''''',
    classifiers = [
        'Development Status :: 3 - Alpha',
        'Environment :: Console',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Software Development :: Libraries :: Python Modules'
    ],
)
